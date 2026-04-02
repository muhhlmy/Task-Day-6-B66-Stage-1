// ======================================
// ELEMENT REFERENCES
// ======================================

// Form inputs
const projectNameInput = document.getElementById("projectName");
const projectDescriptionInput = document.getElementById("projectDescription");
const projectStartDateInput = document.getElementById("projectStartDate");
const projectEndDateInput = document.getElementById("projectEndDate");
const projectImageInput = document.getElementById("projectImage");
const searchProjectInput = document.getElementById("searchProject");

// Containers
const projectContainer = document.getElementById("projectContainer");

// Form
const projectForm = document.getElementById("projectForm");

// Modal
const projectDetailModal = document.getElementById("projectModal");
const closeProjectModalButton = document.getElementById("closeModalBtn");

// ======================================
// STATE
// ======================================

// Menyimpan seluruh data project
let projectDataList = [];

// Ambil data project dari localStorage jika tersedia
const storedProjects = localStorage.getItem("projects");
if (storedProjects) {
  projectDataList = JSON.parse(storedProjects);
}

// ======================================
// FUNCTIONS
// ======================================

// Menampilkan seluruh project ke halaman
function renderProjectList() {
  if (projectDataList.length === 0) {
    projectContainer.innerHTML = `
    <h5 class="text-center text-secondary w-100 mt-5">
      Belum ada project saat ini.
      <br>
      Silakan tambahkan project baru di atas.
    </h5>
    `;
    return;
  }

  projectContainer.innerHTML = projectDataList
    .map((projectItem) => createProjectCard(projectItem))
    .join("");
}

// Menghitung durasi project dalam format bulan
function getReadableProjectDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDifference = end - start; // Hasil dalam miliseconds
  const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Konversi ke hari
  const totalMonths = Math.floor(totalDays / 30); // Konversi sederhana ke bulan

  return `${totalMonths} bulan`;
}

// Menyimpan data project ke localStorage
function saveProjectsToLocalStorage() {
  localStorage.setItem("projects", JSON.stringify(projectDataList));
}

// Membuat HTML card untuk satu project
function createProjectCard(projectItem) {
  let technologyIconsHTML = "";

  if (projectItem.techNodeJs == true) {
    technologyIconsHTML += '<i class="fa-brands fa-node-js fs-4 p-1"></i> ';
  }
  if (projectItem.techNextJs == true) {
    technologyIconsHTML += '<span class="fw-bold fs-6 p-1">Next.JS</span> ';
  }
  if (projectItem.techReactJs == true) {
    technologyIconsHTML += '<i class="fa-brands fa-react fs-4 p-1"></i> ';
  }
  if (projectItem.techTypescript == true) {
    technologyIconsHTML += '<span class="fw-bold fs-6 p-1">TS</span> ';
  }

  return /* HTML */ `
    <div class="col-12 col-md-6 col-lg-4">
      <div
        class="card h-100 shadow-sm border-0 rounded-4 p-3 bg-white up-effect"
      >
        <img
          src="${projectItem.image}"
          class="card-img-top rounded-3"
          alt="Project Image"
          style="object-fit: cover; height: 200px;"
        />
        <div class="card-body px-0 pb-0 text-start d-flex flex-column">
          <h5 class="card-title fw-bold mb-1 text-dark">${projectItem.name}</h5>
          <p class="text-secondary small mb-3">
            Duration: ${projectItem.duration}
          </p>
          <p
            class="card-text text-secondary mb-4"
            style="
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          "
          >
            ${projectItem.description}
          </p>
          <div class="mb-3 text-secondary d-flex align-items-center gap-2">
            ${technologyIconsHTML}
          </div>
          <div class="d-flex gap-2 w-100 mt-auto">
            <button
              class="btn btn-outline-dark w-100 rounded-pill btn-view-details"
              data-id="${projectItem.id}"
            >
              View Details
            </button>
            <button
              class="btn btn-dark w-50 rounded-pill btn-delete"
              data-id="${projectItem.id}"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Kerangka Object Data
function createObjectData(imageSource) {
  return {
    id: Date.now(),
    name: projectNameInput.value,
    description: projectDescriptionInput.value,
    duration: getReadableProjectDuration(
      projectStartDateInput.value,
      projectEndDateInput.value,
    ),
    techNodeJs: document.getElementById("nodejs").checked,
    techNextJs: document.getElementById("nextjs").checked,
    techReactJs: document.getElementById("reactjs").checked,
    techTypescript: document.getElementById("typescript").checked,
    image: imageSource,
  };
}

// Menyimpan Project
function addProject(projectData) {
  projectDataList.push(projectData);
  saveProjectsToLocalStorage();
  renderProjectList();
  projectForm.reset();
}

// ======================================
// EVENT HANDLERS
// ======================================

// Menangani submit form project
projectForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const allowedImageTypes = ["image/png", "image/jpeg"];

  // Ambil file gambar yang di-upload
  let selectedImageFile = projectImageInput.files[0];

  if (
    selectedImageFile &&
    !allowedImageTypes.includes(selectedImageFile.type)
  ) {
    alert("Only JPG and PNG files are allowed.");
    return;
  }

  if (selectedImageFile) {
    // Jika user meng-upload gambar
    const fileReader = new FileReader();

    // Setelah file selesai dibaca
    fileReader.onload = function () {
      const imageSource = fileReader.result; // Hasil file dibaca dalam bentuk base64/url

      addProject(createObjectData(imageSource));

      console.log("Data Project:", projectDataList);
    };

    fileReader.readAsDataURL(selectedImageFile); // Membaca file upload
  } else {
    // Jika tidak ada gambar, gunakan placeholder
    const imageSource = `http://placehold.co/600x400?text=${projectNameInput.value}`;

    addProject(createObjectData(imageSource));

    console.log("Data Project:", projectDataList);
  }
});

// Menangani klik pada tombol detail dan delete
projectContainer.addEventListener("click", function (event) {
  console.log(event);

  if (event.target.classList.contains("btn-view-details")) {
    const selectedProjectId = event.target.getAttribute("data-id");
    console.log(selectedProjectId);

    const selectedProject = projectDataList.find(
      (projectItem) => projectItem.id == selectedProjectId,
    );

    if (selectedProject) {
      document.getElementById("modalTitle").textContent = selectedProject.name;
      document.getElementById("modalImage").src = selectedProject.image;
      document.getElementById("modalDuration").textContent =
        selectedProject.duration;
      document.getElementById("modalDescription").textContent =
        selectedProject.description;

      let technologyIconsHTML = "";
      if (selectedProject.techNodeJs)
        technologyIconsHTML += '<i class="fa-brands fa-node-js fs-4 p-1"></i> ';
      if (selectedProject.techNextJs)
        technologyIconsHTML += '<span class="fw-bold fs-6 p-1">Next.JS</span> ';
      if (selectedProject.techReactJs)
        technologyIconsHTML += '<i class="fa-brands fa-react fs-4 p-1"></i> ';
      if (selectedProject.techTypescript)
        technologyIconsHTML += '<span class="fw-bold fs-6 p-1">TS</span> ';

      document.getElementById("modalTechnologies").innerHTML =
        technologyIconsHTML;

      // Tampilkan modal
      projectDetailModal.classList.remove("d-none");
      projectDetailModal.classList.add("d-flex");
    }
  } else if (event.target.classList.contains("btn-delete")) {
    // Ambil data-id dari tombol delete yang diklik
    const selectedProjectId = event.target.getAttribute("data-id");

    if (confirm("Yakin ingin menghapus Project Ini?")) {
      // Hapus project yang id-nya sesuai
      projectDataList = projectDataList.filter(
        (projectItem) => projectItem.id != selectedProjectId,
      );

      saveProjectsToLocalStorage();
      renderProjectList();
    } else {
      return;
    }
  }
});

// Menangani search Input
searchProjectInput.addEventListener("input", function (e) {
  const keyword = e.target.value.toLowerCase(); // Mengambil value pada Input dan Mengubah menjadi Lower Case

  // Kalo Keyword tidak ada Value
  if (keyword === "") {
    renderProjectList();
    return;
  } else {
    // Jika ada Value pada Keyword
    // Melakukan Filter menyesuaikan nama object yang sama dengan keyword
    const filteredObject = projectDataList.filter((projectItem) =>
      projectItem.name.toLowerCase().includes(keyword),
    );

    // Jika keyword tidak Ditemukan
    if (filteredObject.length === 0) {
      projectContainer.innerHTML = /* HTML */ `
        <h5 class="text-center text-secondary w-100 mt-5">
          Project tidak Ditemukan
        </h5>
      `;
      return;
    } else {
      // Jika keyword ditemukan
      projectContainer.innerHTML = filteredObject
        .map((projectItem) => createProjectCard(projectItem))
        .join("");
    }
  }
});

// Menutup modal dari tombol close
closeProjectModalButton.addEventListener("click", function () {
  projectDetailModal.classList.remove("d-flex");
  projectDetailModal.classList.add("d-none");
});

// Menutup modal saat area luar konten modal diklik
projectDetailModal.addEventListener("click", function (event) {
  if (event.target === projectDetailModal) {
    projectDetailModal.classList.remove("d-flex");
    projectDetailModal.classList.add("d-none");
  }
});

// ======================================
// INITIALIZATION
// ======================================

renderProjectList();
