interface Project {
  id: number;
  image: string;
  title: string;
}

const ProjectsSection = () => {
  const projects: Project[] = [
    { id: 1, image: "/assets/defaultpj.jpg", title: "Music Production Suite" },
    { id: 2, image: "/assets/defaultpj.jpg", title: "Sunset Sessions" },
    { id: 3, image: "/assets/defaultpj.jpg", title: "Live Performance" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;