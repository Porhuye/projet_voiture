package com.example.cars;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VoitureRepository extends JpaRepository<Voiture, Long> {
    boolean existsByImmatriculation(String immatriculation);
}
