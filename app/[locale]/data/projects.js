import { getAllProjectImages } from '../utils/projectImages';

// Get all project detail images at build time.
const projectDetailImages = getAllProjectImages();

export const projects = [
  {
    id: 0,
    imageUrl: "/projects/project0.jpg",
    detailImages: projectDetailImages[0],
    hover: {
      title: "CONTRIBUTOR MAGAZINE",
      description: "2024"
    }
  },
  {
    id: 1,
    imageUrl: "/projects/project1.jpeg",
    detailImages: projectDetailImages[1],
    hover: {
      title: "FOLC EYEWEAR",
      description: "2024"
    }
  },
  {
    id: 2,
    imageUrl: "/projects/project2.jpg",
    detailImages: projectDetailImages[2],
    hover: {
      title: "AUTRY USA",
      description: "2023"
    }
  },
  {
    id: 3,
    imageUrl: "/projects/project3.jpg",
    detailImages: projectDetailImages[3],
    hover: {
      title: "SEIS DEL TRES",
      description: "2023"
    }
  },
  {
    id: 4,
    imageUrl: "/projects/project4.jpg",
    detailImages: projectDetailImages[4],
    hover: {
      title: "SCHON MAGAZINE",
      description: "2023"
    }
  },
  {
    id: 5,
    imageUrl: "/projects/project5.jpg",
    detailImages: projectDetailImages[5],
    hover: {
      title: "E-COMMERCE TOUS",
      description: "2023"
    }
  },
  {
    id: 6,
    imageUrl: "/projects/project6.jpg",
    detailImages: projectDetailImages[6],
    hover: {
      title: "AZZARO PARFUMS",
      description: "2023"
    }
  },
  {
    id: 7,
    imageUrl: "/projects/project7.jpg",
    detailImages: projectDetailImages[7],
    hover: {
      title: "NIKE X GLAMOUR",
      description: "2022"
    }
  },
  {
    id: 8,
    imageUrl: "/projects/project8.jpeg",
    detailImages: projectDetailImages[8],
    hover: {
      title: "SAN VALENTIN, TOUS",
      description: "2022"
    }
  },
  {
    id: 9,
    imageUrl: "/projects/project9.jpeg",
    detailImages: projectDetailImages[9],
    hover: {
      title: "WONDERLAND MAGAZINE, SPECIAL PRADA",
      description: "2022"
    }
  },
  {
    id: 10,
    imageUrl: "/projects/project10.jpeg",
    detailImages: projectDetailImages[10],
    hover: {
      title: "LOEWE X STUDIO GHIBLI, MYTHERESA",
      description: "2021"
    }
  },
  {
    id: 11,
    imageUrl: "/projects/project11.jpg",
    detailImages: projectDetailImages[11],
    hover: {
      title: "MARIE CLAIRE MEXICO, OCTOBER ISSUE",
      description: "2021"
    }
  },
  {
    id: 12,
    imageUrl: "/projects/project12.jpeg",
    detailImages: projectDetailImages[12],
    hover: {
      title: "LEVI'S",
      description: "2021"
    }
  },
  {
    id: 13,
    imageUrl: "/projects/project13.jpg",
    detailImages: projectDetailImages[13],
    hover: {
      title: "HARPER'S BAZAAR MEXICO, AUGUST ISSUE",
      description: "2021"
    }
  },
  {
    id: 14,
    imageUrl: "/projects/project14.jpeg",
    detailImages: projectDetailImages[14],
    hover: {
      title: "MAISONETTE, 'BACK TO SCHOOL'",
      description: "2021"
    }
  },
  {
    id: 15,
    imageUrl: "/projects/project15.jpg",
    detailImages: projectDetailImages[15],
    hover: {
      title: "BEATRIZ FUREST, SS",
      description: "2021"
    }
  },
  {
    id: 16,
    imageUrl: "/projects/project16.jpg",
    detailImages: projectDetailImages[16],
    hover: {
      title: "SPOT CODORNIU USA",
      description: "2021"
    }
  },
  {
    id: 17,
    imageUrl: "/projects/project17.jpg",
    detailImages: projectDetailImages[17],
    hover: {
      title: "PLAZA KVINNA, AUGUST ISSUE",
      description: "2021"
    }
  },
  {
    id: 18,
    imageUrl: "/projects/project18.jpg",
    detailImages: projectDetailImages[18],
    hover: {
      title: "DSCENE, SUMMER ISSUE",
      description: "2021"
    }
  },
  {
    id: 19,
    imageUrl: "/projects/project19.jpg",
    detailImages: projectDetailImages[19],
    hover: {
      title: "EIKO AI, 080 BARCELONA",
      description: "2021"
    }
  }
]; 