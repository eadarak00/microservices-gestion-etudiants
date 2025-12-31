package sn.uasz.m2info.notes_service.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationRequestDto {

    private String type;
    private LocalDate date;
    private Long classeId;
    private Long matiereId;
}
