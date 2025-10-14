package com.example.cars.dto;

import com.example.cars.CarType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record VoitureRequest(
        @NotBlank @Size(max = 100) String carName,
        @NotBlank @Size(max = 50) String couleur,
        @NotBlank @Size(max = 30) String immatriculation,
        @NotNull CarType carType
) {}
