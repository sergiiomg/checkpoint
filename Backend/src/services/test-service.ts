import { TestRepository } from "../repository/test-repository";

class TestService {

    // Declaración
  private repository: TestRepository;

  constructor() {
      // Inicialización
    this.repository = new TestRepository();
  }

 
  async getTestResponse() {
    const response = await this.repository.getTestResponse();

    if (response) {
      return response;
    }
    else {
      return null;
    }
  }
}

export { TestService };