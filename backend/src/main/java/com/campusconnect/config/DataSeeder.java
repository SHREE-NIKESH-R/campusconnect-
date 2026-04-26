package com.campusconnect.config;

import com.campusconnect.entity.Booking;
import com.campusconnect.entity.Resource;
import com.campusconnect.entity.User;
import com.campusconnect.repository.BookingRepository;
import com.campusconnect.repository.ResourceRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        log.info("Seeding demo data...");

        User admin = userRepository.save(User.builder()
                .email("admin@campus.edu")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Admin User")
                .department("Administration")
                .role(User.Role.ADMIN)
                .enabled(true)
                .build());

        User student = userRepository.save(User.builder()
                .email("student@campus.edu")
                .password(passwordEncoder.encode("student123"))
                .fullName("Arjun Krishnan")
                .department("Computer Science")
                .studentId("CS2021001")
                .role(User.Role.STUDENT)
                .enabled(true)
                .build());

        User student2 = userRepository.save(User.builder()
                .email("student2@campus.edu")
                .password(passwordEncoder.encode("student123"))
                .fullName("Priya Mehta")
                .department("Electronics")
                .studentId("EC2021045")
                .role(User.Role.STUDENT)
                .enabled(true)
                .build());

        User faculty = userRepository.save(User.builder()
                .email("faculty@campus.edu")
                .password(passwordEncoder.encode("faculty123"))
                .fullName("Dr. Ramesh Kumar")
                .department("Computer Science")
                .role(User.Role.FACULTY)
                .enabled(true)
                .build());

        User faculty2 = userRepository.save(User.builder()
                .email("faculty2@campus.edu")
                .password(passwordEncoder.encode("faculty123"))
                .fullName("Dr. Anitha Selvam")
                .department("Electronics")
                .role(User.Role.FACULTY)
                .enabled(true)
                .build());

        // Resources
        Resource lab1 = resourceRepository.save(Resource.builder()
                .name("CS Lab A")
                .description("High-performance computing lab with 40 workstations, dual monitors, and dedicated GPU servers.")
                .type(Resource.ResourceType.LAB)
                .location("Block A, Ground Floor")
                .building("Block A").floor("Ground").roomNumber("A001")
                .capacity(40).available(true).active(true)
                .amenities(List.of("AC", "Projector", "High-speed Internet", "Whiteboard", "GPU Servers"))
                .build());

        Resource lab2 = resourceRepository.save(Resource.builder()
                .name("Electronics Lab B")
                .description("Fully equipped electronics lab with oscilloscopes, signal generators and soldering stations.")
                .type(Resource.ResourceType.LAB)
                .location("Block B, First Floor")
                .building("Block B").floor("1st").roomNumber("B102")
                .capacity(30).available(true).active(true)
                .amenities(List.of("AC", "Oscilloscopes", "Signal Generators", "Soldering Stations"))
                .build());

        Resource seminar1 = resourceRepository.save(Resource.builder()
                .name("Seminar Hall 1")
                .description("Spacious seminar hall ideal for presentations, workshops and guest lectures.")
                .type(Resource.ResourceType.SEMINAR_HALL)
                .location("Block B, First Floor")
                .building("Block B").floor("1st").roomNumber("B101")
                .capacity(120).available(true).active(true)
                .amenities(List.of("AC", "Projector", "Mic System", "Stage", "Recording Setup"))
                .build());

        Resource seminar2 = resourceRepository.save(Resource.builder()
                .name("Seminar Hall 2")
                .description("Medium-sized seminar hall for department-level events and seminars.")
                .type(Resource.ResourceType.SEMINAR_HALL)
                .location("Block C, Second Floor")
                .building("Block C").floor("2nd").roomNumber("C201")
                .capacity(80).available(true).active(true)
                .amenities(List.of("AC", "Smart Board", "Mic System", "Webcam"))
                .build());

        Resource classroom1 = resourceRepository.save(Resource.builder()
                .name("Classroom 101")
                .description("Standard smart classroom with interactive board and comfortable seating.")
                .type(Resource.ResourceType.CLASSROOM)
                .location("Block A, First Floor")
                .building("Block A").floor("1st").roomNumber("A101")
                .capacity(60).available(true).active(true)
                .amenities(List.of("AC", "Smart Board", "Projector"))
                .build());

        Resource classroom2 = resourceRepository.save(Resource.builder()
                .name("Classroom 202")
                .description("Well-ventilated classroom suitable for tutorials and small lectures.")
                .type(Resource.ResourceType.CLASSROOM)
                .location("Block C, Second Floor")
                .building("Block C").floor("2nd").roomNumber("C202")
                .capacity(45).available(true).active(true)
                .amenities(List.of("AC", "Projector", "Whiteboard"))
                .build());

        Resource library1 = resourceRepository.save(Resource.builder()
                .name("Library Discussion Room 1")
                .description("Quiet group study room with whiteboards and a large display screen.")
                .type(Resource.ResourceType.LIBRARY_ROOM)
                .location("Library Block, 2nd Floor")
                .building("Library").floor("2nd").roomNumber("LIB-201")
                .capacity(10).available(true).active(true)
                .amenities(List.of("Whiteboard", "TV Screen", "Silent Zone", "Power Outlets"))
                .build());

        Resource library2 = resourceRepository.save(Resource.builder()
                .name("Library Discussion Room 2")
                .description("Cozy study room perfect for small group discussions and project work.")
                .type(Resource.ResourceType.LIBRARY_ROOM)
                .location("Library Block, 2nd Floor")
                .building("Library").floor("2nd").roomNumber("LIB-202")
                .capacity(8).available(true).active(true)
                .amenities(List.of("Whiteboard", "Silent Zone", "Power Outlets"))
                .build());

        Resource auditorium = resourceRepository.save(Resource.builder()
                .name("Main Auditorium")
                .description("900-seat auditorium with professional AV system for large-scale events and convocations.")
                .type(Resource.ResourceType.AUDITORIUM)
                .location("Central Campus")
                .building("Auditorium Block").floor("Ground").roomNumber("AUD-001")
                .capacity(900).available(true).active(true)
                .amenities(List.of("AC", "Full AV System", "Stage", "Green Room", "PA System", "Lighting Rig"))
                .build());

        Resource conference = resourceRepository.save(Resource.builder()
                .name("Conference Room A")
                .description("Executive conference room for faculty meetings, interviews and official discussions.")
                .type(Resource.ResourceType.CONFERENCE_ROOM)
                .location("Admin Block, 3rd Floor")
                .building("Admin Block").floor("3rd").roomNumber("ADM-301")
                .capacity(20).available(true).active(true)
                .amenities(List.of("AC", "Video Conferencing", "Projector", "Whiteboard", "Tea/Coffee"))
                .build());

        Resource sports1 = resourceRepository.save(Resource.builder()
                .name("Indoor Badminton Court")
                .description("Professional badminton court with synthetic flooring and proper lighting.")
                .type(Resource.ResourceType.SPORTS_FACILITY)
                .location("Sports Complex, Ground Floor")
                .building("Sports Complex").floor("Ground").roomNumber("SP-101")
                .capacity(10).available(true).active(true)
                .amenities(List.of("Changing Room", "Equipment Available", "Proper Lighting"))
                .build());

        Resource sports2 = resourceRepository.save(Resource.builder()
                .name("Table Tennis Room")
                .description("Dedicated table tennis room with 4 tables and equipment available.")
                .type(Resource.ResourceType.SPORTS_FACILITY)
                .location("Sports Complex, First Floor")
                .building("Sports Complex").floor("1st").roomNumber("SP-201")
                .capacity(16).available(true).active(true)
                .amenities(List.of("4 Tables", "Equipment Provided", "Changing Room"))
                .build());

        // Bookings — mix of statuses
        bookingRepository.save(Booking.builder()
                .user(student).resource(lab1)
                .bookingDate(LocalDate.now().plusDays(1))
                .startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(11, 0))
                .purpose("Final Year Project Demo Practice")
                .attendeesCount(5).status(Booking.BookingStatus.APPROVED)
                .adminNotes("Approved. Please maintain lab cleanliness.")
                .build());

        bookingRepository.save(Booking.builder()
                .user(faculty).resource(seminar1)
                .bookingDate(LocalDate.now().plusDays(2))
                .startTime(LocalTime.of(14, 0)).endTime(LocalTime.of(16, 0))
                .purpose("Department Seminar on Machine Learning")
                .attendeesCount(80).status(Booking.BookingStatus.PENDING)
                .build());

        bookingRepository.save(Booking.builder()
                .user(student).resource(library1)
                .bookingDate(LocalDate.now())
                .startTime(LocalTime.of(10, 0)).endTime(LocalTime.of(12, 0))
                .purpose("Group Study for End Semester Exams")
                .attendeesCount(6).status(Booking.BookingStatus.APPROVED)
                .build());

        bookingRepository.save(Booking.builder()
                .user(student2).resource(classroom1)
                .bookingDate(LocalDate.now().plusDays(3))
                .startTime(LocalTime.of(11, 0)).endTime(LocalTime.of(13, 0))
                .purpose("Club Recruitment Drive Presentation")
                .attendeesCount(40).status(Booking.BookingStatus.PENDING)
                .build());

        bookingRepository.save(Booking.builder()
                .user(faculty2).resource(conference)
                .bookingDate(LocalDate.now().plusDays(1))
                .startTime(LocalTime.of(10, 0)).endTime(LocalTime.of(11, 0))
                .purpose("PhD Thesis Review Meeting")
                .attendeesCount(8).status(Booking.BookingStatus.APPROVED)
                .build());

        bookingRepository.save(Booking.builder()
                .user(student2).resource(sports1)
                .bookingDate(LocalDate.now().plusDays(1))
                .startTime(LocalTime.of(16, 0)).endTime(LocalTime.of(17, 0))
                .purpose("Inter-college Badminton Practice")
                .attendeesCount(4).status(Booking.BookingStatus.REJECTED)
                .adminNotes("Court already reserved for college team practice.")
                .build());

        bookingRepository.save(Booking.builder()
                .user(student).resource(seminar2)
                .bookingDate(LocalDate.now().plusDays(5))
                .startTime(LocalTime.of(13, 0)).endTime(LocalTime.of(15, 0))
                .purpose("Technical Symposium Planning Meeting")
                .attendeesCount(25).status(Booking.BookingStatus.PENDING)
                .build());

        bookingRepository.save(Booking.builder()
                .user(faculty).resource(lab2)
                .bookingDate(LocalDate.now().plusDays(2))
                .startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(12, 0))
                .purpose("Advanced Electronics Practical Session")
                .attendeesCount(28).status(Booking.BookingStatus.APPROVED)
                .build());

        log.info("✅ Demo data seeded — 5 users, 12 resources, 8 bookings");
        log.info("🔑 admin@campus.edu / admin123");
        log.info("🔑 student@campus.edu / student123");
        log.info("🔑 faculty@campus.edu / faculty123");
    }
}