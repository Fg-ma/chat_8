export type BaseAttributesLocations = "aPositionLocation" | "aTexCoordLocation";

const initializeBaseAttributes = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  baseProgram: WebGLProgram
) => {
  gl.useProgram(baseProgram);

  const aPositionLocation = gl.getAttribLocation(baseProgram, "a_position");
  const aTexCoordLocation = gl.getAttribLocation(baseProgram, "a_texCoord");

  const baseAttributeLocations: {
    [attribute in BaseAttributesLocations]: number | null | undefined;
  } = {
    aPositionLocation: aPositionLocation,
    aTexCoordLocation: aTexCoordLocation,
  };

  return baseAttributeLocations;
};

export default initializeBaseAttributes;
