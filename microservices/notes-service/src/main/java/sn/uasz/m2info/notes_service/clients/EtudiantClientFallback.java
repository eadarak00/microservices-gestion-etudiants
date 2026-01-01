package sn.uasz.m2info.notes_service.clients;

import org.springframework.stereotype.Component;

import sn.uasz.m2info.notes_service.dtos.EtudiantDto;
import sn.uasz.m2info.notes_service.exceptions.ServiceUnavailableException;

@Component
public class EtudiantClientFallback implements EtudiantClient {

    @Override
    public EtudiantDto getEtudiant(Long id) {
        throw new ServiceUnavailableException("Service etudiant indisponible");
    }

    @Override
    public EtudiantDto getEtudiantByMatricule(String matricule) {
        throw new ServiceUnavailableException("Service etudiant indisponible");
    }
}
