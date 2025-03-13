package com.redtrack.controllers.apprenants;
import com.redtrack.dtos.classe.ClassDTO;
import com.redtrack.services.interfaces.ClassService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/apprenant/classes")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('APPRENANT')")
public class ApprenantClassController {
    private final ClassService classService;



    @GetMapping("/own")
    public ResponseEntity<List<ClassDTO>> getApprenantClasses() {
        return ResponseEntity.ok(classService.getApprenantClasses());
    }


}
