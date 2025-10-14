package com.example.cars;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.example.cars.dto.VoitureService;


import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest // démarre tout le contexte Spring pour le test
class VoitureServiceTest {

    @Autowired
    private VoitureService voitureService;

    @Test
    void testSaveVoiture() {
        // Arrange : préparer les données
        Voiture v = new Voiture(null, "Clio", "Rouge", "AA-123-AA", CarType.BERLINE);

        // Act : appeler le service
        Voiture saved = voitureService.save(v);

        // Assert : vérifier le résultat
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCarName()).isEqualTo("Clio");
        assertThat(saved.getCouleur()).isEqualTo("Rouge");
    }
}
