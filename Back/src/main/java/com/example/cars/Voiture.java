package com.example.cars;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "voitures", uniqueConstraints = @UniqueConstraint(columnNames = "immatriculation"))
public class Voiture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 100)
    @Column(name = "car_name", nullable = false)
    private String carName;

    @NotBlank @Size(max = 50)
    private String couleur;

    @NotBlank @Size(max = 30)
    @Column(nullable = false)
    private String immatriculation;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "car_type", nullable = false)
    private CarType carType;

    public Voiture() {}

    public Voiture(Long id, String carName, String couleur, String immatriculation, CarType carType) {
        this.id = id;
        this.carName = carName;
        this.couleur = couleur;
        this.immatriculation = immatriculation;
        this.carType = carType;
    }

    // getters/setters
    //lombok pour faire les setter et getter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCarName() { return carName; }
    public void setCarName(String carName) { this.carName = carName; }
    public String getCouleur() { return couleur; }
    public void setCouleur(String couleur) { this.couleur = couleur; }
    public String getImmatriculation() { return immatriculation; }
    public void setImmatriculation(String immatriculation) { this.immatriculation = immatriculation; }
    public CarType getCarType() { return carType; }
    public void setCarType(CarType carType) { this.carType = carType; }
}
