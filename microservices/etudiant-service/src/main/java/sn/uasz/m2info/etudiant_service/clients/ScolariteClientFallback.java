package sn.uasz.m2info.etudiant_service.clients;

import java.util.List;

import org.springframework.stereotype.Component;
import sn.uasz.m2info.etudiant_service.dtos.ClasseResponseDto;
import sn.uasz.m2info.etudiant_service.exceptions.ServiceUnavailableException;

@Component
public class ScolariteClientFallback implements ScolariteClient {

    public boolean classeExists(Long id) {
        throw new ServiceUnavailableException("ms-scolarite indisponible");

    }

    public List<ClasseResponseDto> getAll() {
        throw new ServiceUnavailableException("ms-scolarite indisponible");
    }
}
