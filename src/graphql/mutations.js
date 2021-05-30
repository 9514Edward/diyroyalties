/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const diyGetRoy = /* GraphQL */ `
  mutation DiyGetRoy($input: DiyGetRoyInput!) {
    diyGetRoy(input: $input)
  }
`;
export const diyGetRoyDetails = /* GraphQL */ `
  mutation DiyGetRoyDetails($input: DiyGetRoyDetailsInput!) {
    diyGetRoyDetails(input: $input)
  }
`;
export const diyGetDefaults = /* GraphQL */ `
  mutation DiyGetDefaults($input: DiyGetDefaultsInput!) {
    diyGetDefaults(input: $input)
  }
`;
export const diySaveDefaults = /* GraphQL */ `
  mutation DiySaveDefaults($input: DiySaveDefaultsInput!) {
    diySaveDefaults(input: $input)
  }
`;
export const diyGetDropdowns = /* GraphQL */ `
  mutation DiyGetDropdowns($input: DiyGetDropdownsInput!) {
    diyGetDropdowns(input: $input)
  }
`;
export const diyGetStatementSettings = /* GraphQL */ `
  mutation DiyGetStatementSettings($input: DiyGetStatementSettingsInput!) {
    diyGetStatementSettings(input: $input)
  }
`;
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
