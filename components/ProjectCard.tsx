import React from "react";
import CircularProgress from "@/components/ui/CircularProgress";

interface ProjectCardProps {
  projectName: string;
  type: string;
  progress: number;
}

export const ProjectCard = ({ projectName, type, progress }: ProjectCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-3">
        <img 
          src="/assets/jacksonwang.jpg"
          alt="Project" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-medium text-card-foreground">{projectName}</div>
          <div className="text-sm text-muted-foreground">({type})</div>
        </div>
      </div>
      <CircularProgress progress={progress} />
    </div>
  );
};