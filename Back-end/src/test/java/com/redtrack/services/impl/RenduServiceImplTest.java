package com.redtrack.services.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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

import com.redtrack.dtos.etape.EtapeAvecRendusDTO;
import com.redtrack.dtos.rendu.RenduDTO;
import com.redtrack.exceptions.RenduException;
import com.redtrack.mappers.RenduMapper;
import com.redtrack.model.entities.Class;
import com.redtrack.model.entities.Etape;
import com.redtrack.model.entities.Rendu;
import com.redtrack.model.entities.User;
import com.redtrack.repositories.ClassRepository;
import com.redtrack.repositories.EtapeRepository;
import com.redtrack.repositories.RenduRepository;
import com.redtrack.repositories.RenduResponseRepository;
import com.redtrack.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class RenduServiceImplTest {

    @Mock
    private RenduRepository renduRepository;

    @Mock
    private RenduResponseRepository renduResponseRepository;

    @Mock
    private RenduMapper renduMapper;


    @Mock
    private UserRepository userRepository;

    @Mock
    private EtapeRepository etapeRepository;

    @Mock
    private ClassRepository classRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private RenduServiceImpl renduService;

    private User apprenant;
    private User formateur;
    private Class classe;
    private Etape etape;
    private Rendu rendu;
    private RenduDTO renduDTO;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);

        apprenant = new User();
        apprenant.setId("1");
        apprenant.setEmail("apprenant@test.com");

        formateur = new User();
        formateur.setId("2");
        formateur.setEmail("formateur@test.com");

        classe = new Class();
        classe.setId("1");
        classe.setActive(true);
        classe.setUsers(new ArrayList<>());
        classe.getUsers().add(apprenant);
        classe.getUsers().add(formateur);

        etape = new Etape();
        etape.setId("1");
        etape.setTitre("Test Etape");
        etape.setDescription("Description");
        etape.setDeadline(new Date());
        List<Class> classes = new ArrayList<>();
        classes.add(classe);
        etape.setClasses(classes);

        rendu = new Rendu();
        rendu.setId("1");
        rendu.setLivrable("Test Livrable");
        rendu.setEtape(etape);
        rendu.setApprenant(apprenant);

        renduDTO = new RenduDTO();
        renduDTO.setEtapeId("1");
        renduDTO.setLivrable("Test Livrable");
    }

    @Test
    void createRendu_Success() {
        List<Class> classes = new ArrayList<>();
        classes.add(classe);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("apprenant@test.com");
        when(userRepository.findByEmail("apprenant@test.com")).thenReturn(Optional.of(apprenant));
        when(classRepository.findByUsersContaining(apprenant)).thenReturn(classes);
        when(etapeRepository.findById("1")).thenReturn(Optional.of(etape));
        when(renduMapper.renduDTOToRendu(renduDTO)).thenReturn(rendu);
        when(renduRepository.save(any(Rendu.class))).thenReturn(rendu);
        when(renduMapper.renduToRenduDTO(rendu)).thenReturn(renduDTO);

        RenduDTO result = renduService.createRendu(renduDTO);

        assertThat(result).isNotNull();
        assertThat(result.getLivrable()).isEqualTo("Test Livrable");
    }

    @Test
    void createRendu_EtapeNotFound_ThrowsException() {
        List<Class> classes = new ArrayList<>();
        classes.add(classe);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("apprenant@test.com");
        when(userRepository.findByEmail("apprenant@test.com")).thenReturn(Optional.of(apprenant));
        when(classRepository.findByUsersContaining(apprenant)).thenReturn(classes);
        when(etapeRepository.findById("1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> renduService.createRendu(renduDTO))
            .isInstanceOf(RenduException.class)
            .hasMessage("Étape non trouvée");
    }

    @Test
    void getMesEtapesAvecRendus_Success() {
        List<Class> classes = new ArrayList<>();
        classes.add(classe);
        List<Etape> etapes = new ArrayList<>();
        etapes.add(etape);
        List<Rendu> rendus = new ArrayList<>();
        rendus.add(rendu);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("apprenant@test.com");
        when(userRepository.findByEmail("apprenant@test.com")).thenReturn(Optional.of(apprenant));
        when(classRepository.findByUsersContaining(apprenant)).thenReturn(classes);
        when(etapeRepository.findByClassesContainingOrderByCreatedAtDesc(classe)).thenReturn(etapes);
        when(renduRepository.findByEtapeIdAndApprenantId(etape.getId(), apprenant.getId()))
            .thenReturn(rendus);
        when(renduMapper.renduToRenduDTO(rendu)).thenReturn(renduDTO);
        when(renduResponseRepository.findByRenduId(rendu.getId())).thenReturn(new ArrayList<>());

        List<EtapeAvecRendusDTO> result = renduService.getMesEtapesAvecRendus();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitre()).isEqualTo("Test Etape");
    }

    @Test
    void getEtapesAvecRendusByApprenant_Success() {
        List<Class> classes = new ArrayList<>();
        classes.add(classe);
        List<Etape> etapes = new ArrayList<>();
        etapes.add(etape);
        List<Rendu> rendus = new ArrayList<>();
        rendus.add(rendu);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("formateur@test.com");
        when(userRepository.findByEmail("formateur@test.com")).thenReturn(Optional.of(formateur));
        when(userRepository.findById("1")).thenReturn(Optional.of(apprenant));
        when(classRepository.findByUsersContaining(formateur)).thenReturn(classes);
        when(classRepository.findByUsersContaining(apprenant)).thenReturn(classes);
        when(etapeRepository.findByClassesContainingOrderByCreatedAtDesc(classe)).thenReturn(etapes);
        when(renduRepository.findByEtapeIdAndApprenantId(etape.getId(), apprenant.getId()))
            .thenReturn(rendus);
        when(renduMapper.renduToRenduDTO(rendu)).thenReturn(renduDTO);
        when(renduResponseRepository.findByRenduId(rendu.getId())).thenReturn(new ArrayList<>());

        List<EtapeAvecRendusDTO> result = renduService.getEtapesAvecRendusByApprenant("1");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitre()).isEqualTo("Test Etape");
    }

    @Test
    void getEtapesAvecRendusByApprenant_ApprenantNotFound_ThrowsException() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("formateur@test.com");
        when(userRepository.findByEmail("formateur@test.com")).thenReturn(Optional.of(formateur));
        when(userRepository.findById("1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> renduService.getEtapesAvecRendusByApprenant("1"))
            .isInstanceOf(RenduException.class)
            .hasMessage("Apprenant non trouvé");
    }


} 