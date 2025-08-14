const z = require('zod');

class WitnessesService {
  WitnessValidation = z.object({
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.string(),
    contact_number: z.string(),
  })
}

const witnessesService = new WitnessesService()

module.exports = witnessesService;
