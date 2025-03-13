package com.redtrack.services.interfaces;

import com.redtrack.dtos.classe.ClassDTO;
import com.redtrack.dtos.classe.ClassDetailsDTO;
import com.redtrack.dtos.classe.CreateClassRequest;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface ClassService {
    ClassDTO createClass(CreateClassRequest request);
    ClassDTO getClass(String id);
    Page<ClassDTO> getAllClasses(Pageable pageable);
    ClassDTO updateClass(String id, CreateClassRequest request);
    void archiveClass(String id);
    void unarchiveClass(String id);
    ClassDTO updateFormateurClass(String id, CreateClassRequest request);
    Page<ClassDTO> getArchivedClasses(Pageable pageable);
    ClassDetailsDTO getClassDetails(String id);
    List<ClassDTO> getFormateurClasses();
    List<ClassDTO> getApprenantClasses();
}
