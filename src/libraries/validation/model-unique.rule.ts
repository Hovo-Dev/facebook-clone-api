import {ObjectLiteral} from "../../typings/shared.type";

export default <T extends ObjectLiteral>(
    field: keyof T,
    repository: ObjectLiteral,
) => {
  return async (input) => {
    // Use Repository to find a record
    const result = await repository.findOne(field, input);

    // Returns `true` if no record exists (meaning it's unique)
    return result === null;
  };
};
