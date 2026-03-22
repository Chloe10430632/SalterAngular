import { TagDto } from "./TagDto";

export interface CreatePostDto {
  userId: number;
  boardId: number;
  content: string | null;
  locationId: number | null;
  isPosted: boolean;
  imageUrls: string[];
  tags: TagDto[];
}
