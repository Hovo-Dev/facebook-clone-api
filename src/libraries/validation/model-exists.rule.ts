import {ObjectLiteral} from "../../typings/shared.type";

export default <T extends ObjectLiteral>(
    field: keyof T,
    repository: ObjectLiteral,
) => {
  return async (input) => {
    // Ensures all exist
    return  repository.exists(field, input);
  };
};
