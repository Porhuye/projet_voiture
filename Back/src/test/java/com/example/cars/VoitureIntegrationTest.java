package com.example.cars;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test d’intégration “bout en bout” :
 * - login pour obtenir un JWT
 * - CRUD complet sur /api/voitures
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // <- utilise application-test.yml
class VoitureIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper om;

    private String bearer;

    @BeforeEach
    void login() throws Exception {
        // identifiants configurés dans SecurityConfig (admin/admin123)
        String body = """
                {"username":"admin","password":"admin123"}
                """;
        MvcResult res = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = om.readTree(res.getResponse().getContentAsString());
        String token = json.get("token").asText();
        assertThat(token).isNotBlank();
        bearer = "Bearer " + token;
    }

    @Test
    void crudVoitures_endToEnd() throws Exception {
        // ---------- CREATE ----------
        String immat = "IT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String createBody = """
                {
                  "carName": "Clio IT",
                  "couleur": "Rouge",
                  "immatriculation": "%s",
                  "carType": "BERLINE"
                }
                """.formatted(immat);

        MvcResult createRes = mvc.perform(post("/api/voitures")
                        .header("Authorization", bearer)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())                  // <- 201 au lieu de 200
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.immatriculation").value(immat))
                .andReturn();

        long id = om.readTree(createRes.getResponse().getContentAsString())
                .get("id").asLong();

        // ---------- LIST ----------
        mvc.perform(get("/api/voitures")
                        .header("Authorization", bearer))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists());

        // ---------- GET BY ID ----------
        mvc.perform(get("/api/voitures/{id}", id)
                        .header("Authorization", bearer))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.carName").value("Clio IT"));

        // ---------- UPDATE ----------
        String updateBody = """
                {
                  "carName": "Clio IT - Maj",
                  "couleur": "Bleu",
                  "immatriculation": "%s",
                  "carType": "BERLINE"
                }
                """.formatted(immat);

        mvc.perform(put("/api/voitures/{id}", id)
                        .header("Authorization", bearer)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.carName").value("Clio IT - Maj"))
                .andExpect(jsonPath("$.couleur").value("Bleu"));

        // ---------- DELETE ----------
        mvc.perform(delete("/api/voitures/{id}", id)
                        .header("Authorization", bearer))
                .andExpect(status().isNoContent());

        // ---------- GET après delete -> 4xx ----------
        mvc.perform(get("/api/voitures/{id}", id)
                        .header("Authorization", bearer))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void access_denied_without_token() throws Exception {
        mvc.perform(get("/api/voitures"))
                .andExpect(status().isUnauthorized())  // 401 attendu sans token
                .andReturn();
    }
}
