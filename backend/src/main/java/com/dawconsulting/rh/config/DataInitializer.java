package com.dawconsulting.rh.config;

import com.dawconsulting.rh.model.*;
import com.dawconsulting.rh.repository.AdminUserRepository;
import com.dawconsulting.rh.repository.JobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AdminUserRepository adminRepo;
    private final JobRepository jobRepo;
    private final PasswordEncoder encoder;

    @Value("${app.admin.email}") private String adminEmail;
    @Value("${app.admin.password}") private String adminPassword;
    @Value("${app.admin.fullName}") private String adminName;

    public DataInitializer(AdminUserRepository adminRepo, JobRepository jobRepo, PasswordEncoder encoder) {
        this.adminRepo = adminRepo;
        this.jobRepo = jobRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (!adminRepo.existsByEmailIgnoreCase(adminEmail)) {
            AdminUser admin = new AdminUser();
            admin.setFullName(adminName);
            admin.setEmail(adminEmail);
            admin.setPasswordHash(encoder.encode(adminPassword));
            admin.setRole("ROLE_ADMIN");
            adminRepo.save(admin);
            log.info("Compte administrateur cree : {}", adminEmail);
        }

        if (jobRepo.count() == 0) {
            seedJob("Gestionnaire de Paie Senior", "Paie", "Douala, Cameroun", ContractType.CDI,
                    "Confirme",
                    "DAWC-HR recherche un gestionnaire de paie pour piloter le traitement de la paie de nos clients externalises et garantir la conformite reglementaire camerounaise.",
                    "Etablir les bulletins de paie ; piloter les teledeclarations CNPS ; assurer le suivi des immatriculations ; conseiller les clients sur l'optimisation des cotisations sociales.",
                    "Bac+3 minimum en gestion/RH ; 4 ans d'experience en paie ; maitrise du droit social camerounais et des procedures CNPS ; rigueur et confidentialite.");
            seedJob("Consultant CNPS & Contentieux", "CNPS", "Douala, Cameroun", ContractType.CDI,
                    "Senior",
                    "Rejoignez notre pole conformite pour accompagner les entreprises dans leurs audits, contentieux et optimisations CNPS.",
                    "Realiser les audits de conformite ; representer les clients lors des controles ; gerer les contentieux de recouvrement ; former les equipes clientes.",
                    "Experience confirmee en securite sociale ou ex-controleur CNPS ; excellente connaissance de la reglementation ; capacite de negociation.");
            seedJob("Charge de Recrutement & Interim", "Interim", "Douala, Cameroun", ContractType.CDI,
                    "Junior",
                    "Pilotez le sourcing et le placement de personnel temporaire pour nos entreprises clientes dans un modele de mise a disposition transparent.",
                    "Sourcer et qualifier les candidats ; gerer les contrats de mission ; assurer l'encadrement des interimaires ; fideliser les clients.",
                    "Bac+2/3 en RH ; aisance relationnelle ; sens de l'organisation ; la connaissance du tissu industriel de Douala est un plus.");
            log.info("3 offres d'exemple inserees.");
        }
    }

    private void seedJob(String title, String dept, String loc, ContractType type, String level,
                         String desc, String resp, String req) {
        Job j = new Job();
        j.setTitle(title); j.setDepartment(dept); j.setLocation(loc);
        j.setContractType(type); j.setExperienceLevel(level);
        j.setDescription(desc); j.setResponsibilities(resp); j.setRequirements(req);
        j.setStatus(JobStatus.PUBLISHED);
        jobRepo.save(j);
    }
}
