package com.redtrack.services.impl;

import java.util.ArrayList;
import java.util.Date;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.redtrack.dtos.etape.EtapeDTO;
import com.redtrack.mappers.EtapeMapper;
import com.redtrack.model.entities.Class;
import com.redtrack.model.entities.Etape;
import com.redtrack.model.entities.User;
import com.redtrack.repositories.ClassRepository;
import com.redtrack.repositories.EtapeRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.UserService;

@ExtendWith(MockitoExtension.class)
class EtapeServiceImplTest {

    @Mock
    private EtapeRepository etapeRepository;

    @Mock
    private ClassRepository classRepository;

    @Mock
    private EtapeMapper etapeMapper;

    @Mock
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private EtapeServiceImpl etapeService;

    private Etape etape;
    private EtapeDTO etapeDTO;
    private User formateur;
    private Class classe;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);
        
        etape = new Etape();
        etape.setId("1");
        etape.setTitre("Test Etape");
        etape.setDescription("Description");
        etape.setDeadline(new Date(System.currentTimeMillis() + 86400000));

        etapeDTO = new EtapeDTO();
        etapeDTO.setTitre("Test Etape");
        etapeDTO.setDescription("Description");
        etapeDTO.setDeadline(new Date(System.currentTimeMillis() + 86400000));

        formateur = new User();
        formateur.setId("1");
        formateur.setEmail("formateur@test.com");

        classe = new Class();
        classe.setId("1");
        classe.setActive(true);
        classe.setUsers(new ArrayList<>());
        classe.getUsers().add(formateur);

        // Configuration du SecurityContext pour tous les tests
        when(securityContext.getAuthentication()).thenReturn(authentication);
    }

    @Test
    void createEtape_Success() {
        List<Class> classes = new ArrayList<>();
        classes.add(classe);

        when(authentication.getName()).thenReturn("formateur@test.com");
        when(userService.getCurrentFormateur()).thenReturn(formateur);
        when(classRepository.findByUsersContaining(formateur)).thenReturn(classes);
        when(etapeMapper.mapWithClasses(etapeDTO)).thenReturn(etape);
        when(etapeRepository.save(any(Etape.class))).thenReturn(etape);
        when(etapeMapper.etapeToEtapeDTO(etape)).thenReturn(etapeDTO);

        EtapeDTO result = etapeService.createEtape(etapeDTO);

        assertThat(result).isNotNull();
        assertThat(result.getTitre()).isEqualTo(etapeDTO.getTitre());
    }


    @Test
    void getAllEtapes_Success() {
        List<Class> classes = new ArrayList<>();
        classes.add(classe);
        List<Etape> etapes = new ArrayList<>();
        etapes.add(etape);

        when(authentication.getName()).thenReturn("formateur@test.com");
        when(userService.getCurrentFormateur()).thenReturn(formateur);
        when(classRepository.findByUsersContaining(formateur)).thenReturn(classes);
        when(etapeRepository.findByClassesContainingOrderByCreatedAtDesc(classe))
            .thenReturn(etapes);
        when(etapeMapper.etapeToEtapeDTO(etape)).thenReturn(etapeDTO);

        List<EtapeDTO> result = etapeService.getAllEtapes();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitre()).isEqualTo(etapeDTO.getTitre());
    }

    @Test
    void getEtapesForCurrentApprenant_Success() {
        User apprenant = new User();
        apprenant.setEmail("apprenant@test.com");

        List<Class> classes = new ArrayList<>();
        classes.add(classe);
        List<Etape> etapes = new ArrayList<>();
        etapes.add(etape);

        when(authentication.getName()).thenReturn("apprenant@test.com");
        when(userRepository.findByEmail("apprenant@test.com")).thenReturn(Optional.of(apprenant));
        when(classRepository.findByUsersContaining(apprenant)).thenReturn(classes);
        when(etapeRepository.findByClassesContainingOrderByCreatedAtDesc(classe))
            .thenReturn(etapes);
        when(etapeMapper.etapeToEtapeDTO(etape)).thenReturn(etapeDTO);

        List<EtapeDTO> result = etapeService.getEtapesForCurrentApprenant();

        assertThat(result).hasSize(1);
    }

  
} 