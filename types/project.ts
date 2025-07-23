export const types = ["All", "Album", "Security", "Single", "Tour", "Venue"] as const;
export type ProjectType = (typeof types)[number];

export interface Project {
  id: number;
  name: string;
  type: ProjectType;
  members: any[];
  progress: string;
  badgeColor: string;
  image: string;
}