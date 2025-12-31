package sn.uasz.m2info.scolarite_service.clients;

import java.util.List;

import sn.uasz.m2info.scolarite_service.dtos.EtudiantResponseDto;
import sn.uasz.m2info.scolarite_service.exceptions.ServiceUnavailableException;

import org.springframework.stereotype.Component;

@Component
public class EtudiantClientFallback implements EtudiantClient {

    public List<EtudiantResponseDto> getEtudiantsByClasse(Long classeId) {
        throw new ServiceUnavailableException("ms-etudiant indisponible");
    }
}
