export class OverpassNodeDto {
  id: number;
  lat: number;
  lon: number;
  tags: { [key: string]: string };
}