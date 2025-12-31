package com.example.ms_scolarite.service;

import com.example.ms_scolarite.dto.Inscriptiondto;
import com.example.ms_scolarite.dto.InscriptionRequest;
import com.example.ms_scolarite.dto.InscriptionResponse;

import java.util.List;

public interface InscriptionService {

    InscriptionResponse createInscription(InscriptionRequest request);

    List<Inscriptiondto> getAllInscriptions();

    Inscriptiondto getInscriptionById(Long id);

    Inscriptiondto updateInscription(Long id, Long classeId, String statut);

    void deleteInscription(Long id);

    List<Inscriptiondto> getInscriptionsByEtudiant(Long etudiantId);
}
