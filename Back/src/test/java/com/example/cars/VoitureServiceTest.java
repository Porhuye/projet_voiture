package com.example.cars;

import com.example.cars.dto.VoitureRequest;
import com.example.cars.dto.VoitureResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class VoitureServiceTest {

    @Autowired
    private VoitureService voitureService;

    @Test
    void testCreateVoiture() {
        VoitureRequest req = new VoitureRequest(
                "Clio",
                "Rouge",
                "AA-123-AA",
                CarType.BERLINE   // <- import com.example.cars.CarType
        );

        VoitureResponse saved = voitureService.create(req);

        assertThat(saved).isNotNull();
        assertThat(saved.id()).isNotNull();
        assertThat(saved.carName()).isEqualTo("Clio");
        assertThat(saved.couleur()).isEqualTo("Rouge");
        assertThat(saved.immatriculation()).isEqualTo("AA-123-AA");
        assertThat(saved.carType()).isEqualTo(CarType.BERLINE);
    }
}
