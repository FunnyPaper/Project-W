#version 300 es

in vec3 aPosition;
in vec2 aTexture;
uniform mat4 mvp;

out vec2 vTexture;

void main()
{
    vTexture = aTexture;
    gl_Position = mvp * vec4(aPosition, 1.0);
}