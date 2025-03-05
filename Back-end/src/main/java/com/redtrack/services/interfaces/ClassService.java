package com.redtrack.services.interfaces;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.redtrack.dtos.ClassDTO;
import com.redtrack.dtos.ClassDetailsDTO;
import com.redtrack.dtos.CreateClassRequest;

public interface ClassService {
    ClassDTO createClass(CreateClassRequest request);
    ClassDTO getClass(String id);
    Page<ClassDTO> getAllClasses(Pageable pageable);
    ClassDTO updateClass(String id, CreateClassRequest request);
    void archiveClass(String id);
    void unarchiveClass(String id);
    ClassDTO updateFormateurClass(String id, CreateClassRequest request);
    ClassDTO getFormateurOwnClass();
    Page<ClassDTO> getArchivedClasses(Pageable pageable);
    ClassDetailsDTO getClassDetails(String id);
}
