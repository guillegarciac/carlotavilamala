import fs from 'fs';
import path from 'path';

export function getProjectDetailImages(projectId) {
  const projectPath = path.join(process.cwd(), 'public', 'projectsDetail', `project${projectId}`);
  
  try {
    // Read the directory
    const files = fs.readdirSync(projectPath);
    
    // Filter for image files and create full paths
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => `/projectsDetail/project${projectId}/${file}`);
    
    return imageFiles;
  } catch (error) {
    console.warn(`No detail images found for project${projectId}:`, error.message);
    return [];
  }
}

export function getAllProjectImages() {
  const projects = {};
  
  // Scan for all project folders (0-19)
  for (let i = 0; i < 21; i++) {
    projects[i] = getProjectDetailImages(i);
  }
  
  return projects;
} 