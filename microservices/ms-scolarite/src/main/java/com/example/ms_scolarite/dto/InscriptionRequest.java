package com.example.ms_scolarite.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InscriptionRequest {
    private Long etudiantId;
    private Long classeId;
}
