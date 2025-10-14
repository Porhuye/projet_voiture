package com.example.cars.dto;

import com.example.cars.CarType;

public record VoitureResponse(
        Long id,
        String carName,
        String couleur,
        String immatriculation,
        CarType carType
) {}
