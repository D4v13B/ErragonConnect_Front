export class LocalStorageService {
  // Guardar un valor
  static setItem(key: string, value: any): void {
    try {
      const jsonData = JSON.stringify(value);
      localStorage.setItem(key, jsonData);
    } catch (error) {
      console.error("Error guardando en localStorage", error);
    }
  }

  // Obtener un valor
  static getItem<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error("Error leyendo de localStorage", error);
      return null;
    }
  }

  // Eliminar un valor
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error eliminando de localStorage", error);
    }
  }

  // Limpiar todo el localStorage
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error limpiando localStorage", error);
    }
  }
}
