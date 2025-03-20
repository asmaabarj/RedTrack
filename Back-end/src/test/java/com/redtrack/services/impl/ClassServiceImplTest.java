package com.redtrack.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.redtrack.dtos.classe.ClassDTO;
import com.redtrack.dtos.classe.CreateClassRequest;
import com.redtrack.mappers.ClassMapper;
import com.redtrack.model.entities.Class;
import com.redtrack.repositories.ClassRepository;

@ExtendWith(MockitoExtension.class)
class ClassServiceImplTest {

    @Mock
    private ClassRepository classRepository;

    @Mock
    private ClassMapper classMapper;


    @InjectMocks
    private ClassServiceImpl classService;

    private Class classe;
    private ClassDTO classDTO;
    private CreateClassRequest createRequest;

    @BeforeEach
    void setUp() {
        classe = new Class();
        classe.setId("1");
        classe.setNom("Test Class");
        classe.setNiveau("Niveau 1");
        classe.setAnnee("2024");
        classe.setActive(true);

        classDTO = new ClassDTO();
        classDTO.setId("1");
        classDTO.setNom("Test Class");
        classDTO.setNiveau("Niveau 1");
        classDTO.setAnnee("2024");
        classDTO.setActive(true);

        createRequest = new CreateClassRequest();
        createRequest.setNom("Test Class");
        createRequest.setNiveau("Niveau 1");
        createRequest.setAnnee("2024");
    }

    @Test
    void createClass_Success() {
        when(classRepository.existsByNom(createRequest.getNom())).thenReturn(false);
        when(classRepository.save(any(Class.class))).thenReturn(classe);
        when(classMapper.classToClassDTO(classe)).thenReturn(classDTO);

        ClassDTO result = classService.createClass(createRequest);

        assertThat(result).isNotNull();
        assertThat(result.getNom()).isEqualTo(createRequest.getNom());
        assertThat(result.getNiveau()).isEqualTo(createRequest.getNiveau());
        assertThat(result.getAnnee()).isEqualTo(createRequest.getAnnee());
    }


    @Test
    void getAllClasses_Success() {
        List<Class> classes = new ArrayList<>();
        classes.add(classe);
        Page<Class> classPage = new PageImpl<>(classes);
        
        when(classRepository.findByActiveTrueOrderByIdDesc(any(Pageable.class))).thenReturn(classPage);
        when(classMapper.classToClassDTO(any(Class.class))).thenReturn(classDTO);

        Page<ClassDTO> result = classService.getAllClasses(Pageable.unpaged());

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getNom()).isEqualTo(classe.getNom());
    }


    @Test
    void getClass_Success() {
        when(classRepository.findById("1")).thenReturn(Optional.of(classe));
        when(classMapper.classToClassDTO(classe)).thenReturn(classDTO);

        ClassDTO result = classService.getClass("1");

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("1");
    }


    @Test
    void updateClass_Success() {
        when(classRepository.findById("1")).thenReturn(Optional.of(classe));
        when(classRepository.save(any(Class.class))).thenReturn(classe);
        when(classMapper.classToClassDTO(classe)).thenReturn(classDTO);

        ClassDTO result = classService.updateClass("1", createRequest);

        assertThat(result).isNotNull();
        assertThat(result.getNom()).isEqualTo(createRequest.getNom());
    }

    @Test
    void archiveClass_Success() {
        when(classRepository.findById("1")).thenReturn(Optional.of(classe));
        when(classRepository.save(any(Class.class))).thenReturn(classe);

        classService.archiveClass("1");

        assertThat(classe.getActive()).isFalse();
    }


} 