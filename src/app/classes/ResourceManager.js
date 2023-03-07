import { gl } from './WebGL2.js';
import { ShaderStage } from './ShaderStage.js';
import { Shader } from './Shader.js';
import { Texture2D } from './Texture2D.js';
import { Buffer } from './Buffer.js';
import { VertexArray } from './VertexArray.js';

export class ResourceManager {
    //
    // fields
    //

    /** @type {Map<string, ShaderStage>} */
    static #shaderStagesMap = new Map();
    /** @type {Map<string, Shader>} */
    static #shadersMap = new Map();
    /** @type {Map<string, Texture2D>} */
    static #texturesMap = new Map();
    /** @type {Map<string, Buffer>} */
    static #buffersMap = new Map();
    /** @type {Map<string, VertexArray>} */
    static #vertexArraysMap = new Map();
    
    //
    // properties
    //

    /**
     * Retrieves ShaderStage object
     * @param {Object} obj Config object
     * @param {string} obj.name Name of ShaderStage object
     * @returns {ShaderStage} ShaderStage object
     */
    static getShaderStage({name}) {
        return ResourceManager.#shaderStagesMap.get(name);
    }

    /**
     * Retrieves Shader object
     * @param {Object} obj Config object
     * @param {string} obj.name Name of Shader object
     * @returns {Shader} Shader object
     */				
    static getShader({name}) {
        return ResourceManager.#shadersMap.get(name);
    }

    /**
     * Retrieves Texture2D object
     * @param {Object} obj Config object
     * @param {string} obj.name Name of Texture2D object
     * @returns {Texture2D} Texture2D object
     */
    static getTexture({name}) {
        return ResourceManager.#texturesMap.get(name);
    }

    /**
     * Retrieves Buffer object
     * @param {Object} obj Config object
     * @param {string} obj.name Name of Buffer object
     * @returns {Buffer} Buffer object
     */
    static getBuffer({name}) {
        return ResourceManager.#buffersMap.get(name);
    }

    /**
     * Retrieves VertexArray object
     * @param {Object} obj Config object
     * @param {string} obj.name Name of VertexArray object
     * @returns {VertexArray} VertexArray object
     */
    static getVertexArray({name}) {
        return ResourceManager.#vertexArraysMap.get(name);
    }
    
    //
    // ShaderStage constructors
    //

    /**
     * Create and register new ShaderStage from string
     * @param {Object} obj Config object
     * @param {string} obj.name ShaderStage name
     * @param {number} obj.type ShaderStage type
     * @param {string} obj.source ShaderStage source
     * @returns {ShaderStage} ShaderStage object
     */
    static createShaderStageFromString({name, type, source}) {
        // Create ShaderStage object
        const stage = new ShaderStage();
        // Compile shader stage
        stage.compile({stageType: type, stageSource: source});
        // Store shader stage in map
        ResourceManager.#shaderStagesMap.set(name, stage);
        return stage;
    }

    /**
     * Create and register new ShaderStage from HTML tag
     * @param {Object} obj Config object
     * @param {string} obj.name ShaderStage name
     * @param {number} obj.type ShaderStage type
     * @param {string} obj.css ShaderStage CSS string pointing to HTML script tag with source
     * @returns {ShaderStage} ShaderStage object
     */
    static createShaderStageFromTag({name, type, css}) {
        const tag = document.querySelector(css);
        return ResourceManager.createShaderStageFromString({name, type, source: tag.text});
    }

    /**
     * Create and register new ShaderStage from file
     * @param {Object} obj Config object
     * @param {string} obj.name ShaderStage name
     * @param {number} obj.type ShaderStage type
     * @param {string} obj.file File containing ShaderStage source code
     * @returns {Promise<ShaderStage>} Promise with ShaderStage object
     */
    static async createShaderStageFromFile({name, type, file}) {
        const source = await fetch(file).then(response => response.text());
        return ResourceManager.createShaderStageFromString({name, type, source});
    }
    
    //
    // Shader contructors
    //

    /**
     * Create and register new Shader from ShaderStage objects
     * @param {Object} obj Config object
     * @param {string} obj.name Shader name
     * @param {ShaderStage[]} obj.stages Parts of shader program
     * @returns {Shader} Shader object
     */
    static createShader({name, validate = false, stages}) {
        // Create Shader object and set it's fields
        const shader = new Shader();
        // Compile and validate shader
        shader.compile({stages});
        if(validate) {
            shader.validate();
        }
        // Store shader in map
        ResourceManager.#shadersMap.set(name, shader);
        return shader;
    }

    /**
     * Create and register new Shader from ShaderStage source strings
     * @param {Object} obj Config object 
     * @param {boolean} obj.validate Whenever validation will be made 
     * @param {{name: string, type: number, source: string}[]} obj.stages Config objects for ShaderStage objects
     * @returns {Shader} Shader object
     */
    static createShaderFromString({name, validate = false, stages}) {
        // For every shader stage source contruct new ShaderStage object
        stages = stages.map(stage => ResourceManager.createShaderStageFromString({...stage})) 
        // Forward job after all ShaderStage objects has been created
        return ResourceManager.createShader({name, validate, stages});
    }

    /**
     * Create and register new Shader from ShaderStage HTML tags
     * @param {Object} obj Config object 
     * @param {boolean} obj.validate Whenever validation will be made 
     * @param {{name: string, type: number, css: string}[]} obj.stages Config objects for ShaderStage objects
     * @returns {Shader} Shader object
     */
    static createShaderFromTag({name, validate = false, stages}) {
        // For every shader stage append it's source
        stages.map(stage => stage.source = document.querySelector(stage.css).text);
        // Forward job after every shader stage has access to it's source
        return ResourceManager.createShaderFromString({name, validate, stages});
    }

    /**
     * Create and register new Shader from ShaderStage files
     * @param {Object} obj Config object 
     * @param {boolean} obj.validate Whenever validation will be made 
     * @param {{name: string, type: number, file: string}[]} obj.stages Config objects for ShaderStage objects
     * @returns {Promise<Shader>} Promise with Shader object
     */
    static createShaderFromFile({name, validate = false, stages}) {
        // For every shader stage append it's source
        // Then forward job after every shader stage has access to it's source
        return Promise.all(
            stages.map(async(stage) => await fetch(stage.file)
                                                .then(response => response.text())
                                                .then(source => stage.source = source))
        ).then(() => ResourceManager.createShaderFromString({name, validate, stages}));
    }
    
    //
    // Texture constructors
    //

    /**
     * Create and register new Texture2D from file
     * @param {Object} obj Config object 
     * @param {string} obj.name Texture2D name
     * @param {string} obj.source Texture2D source file
     * @param {boolean} obj.alpha Whenever alpha channel is present
     * @returns {Promise<Texture2D>} Promise with Texture2D object
     */
    static createTexture2DFromFile({name, source, alpha}) {
        // Fetch followed by createImageBitmap won't work with WebGL2 flipY 
        // Instead provide promise api to older image's onload event
        return new Promise(resolve => {
            const data = new Image();
            data.addEventListener('load', () => resolve(data));
            data.crossOrigin = "";
            data.src = source; // reload image by changing it's source
        }).then(data => ResourceManager.createTexture2D({name, data, alpha}));
    }

    /**
     * Create and register new Texture2D from HTML tag
     * @param {Object} obj Config object 
     * @param {string} obj.name Texture2D name
     * @param {string} obj.css Texture2D CSS string pointing to HTML script tag with source
     * @param {boolean} obj.alpha Whenever alpha channel is present
     * @returns {Texture2D} Texture2D object
     */
    static createTexture2DFromTag({name, css, alpha}) {
        // Grab Image tag from DOM specified by CSS
        const data = document.querySelector(css);
        // Forward job after getting data
        return ResourceManager.createTexture2D({name, data, alpha});
    }

    /**
     * Create and register new Texture2D from data
     * @param {Object} obj Config object 
     * @param {string} obj.name Texture2D name
     * @param {HTMLCanvasElement | HTMLImageElement} obj.data Texture2D data 
     * @param {boolean} obj.alpha Whenever alpha channel is present
     * @returns {Texture2D} Texture2D object
     */
    static createTexture2D({name, data, alpha}) {
        // Create Texture2D and set it's fields
        const texture = new Texture2D();
        if(alpha) {
            texture.format = gl().RGBA;
            texture.internalFormat = gl().RGBA;
        }
        // Populate texture with data
        texture.generate({source: data});
        // Store texture in map
        ResourceManager.#texturesMap.set(name, texture);
        return texture;
    }

    //
    // Buffer constructors
    //

    /**
     * Create and register new Buffer
     * @param {Object} obj Config object 
     * @param {string} obj.name Buffer name
     * @param {number} obj.bufferType Buffer type 
     * @param {number} obj.usage Buffer usage
     * @returns {Buffer} Buffer object
     */
    static createBuffer({ name, bufferType, dataType, usage }) {
        const buffer = new Buffer({ bufferType, dataType, usage });
        ResourceManager.#buffersMap.set(name, buffer);
        return buffer;
    }
    
    //
    // VertexArray constructors
    //

    /**
     * 
     * @param {Object} obj Config object
     * @param {string} obj.name VertexArray name
     * @param {Set<Buffer>} obj.buffers Buffer set
     */
    static createVertexArray({ name, buffers = new Set() }) {
        const vArray = new VertexArray();
        vArray.setBuffers({ buffers });
        ResourceManager.#vertexArraysMap.set(name, vArray);
        return vArray;
    }

    //
    // Utility
    //

    /**
     * Free memory from webgl2's internal objects
     */
    static clear() {
        // Reclaim memory from WebGL2 references
        ResourceManager.#shaderStagesMap.forEach((value) => value.delete());
        ResourceManager.#shadersMap.forEach((value) => value.delete());
        ResourceManager.#texturesMap.forEach((value) => value.delete());
        ResourceManager.#buffersMap.forEach((value) => value.delete());
        ResourceManager.#vertexArraysMap.forEach((value) => value.delete());
        
        // Clear maps from unused objects
        ResourceManager.#shaderStagesMap.clear();
        ResourceManager.#shadersMap.clear();
        ResourceManager.#texturesMap.clear();
        ResourceManager.#buffersMap.clear();
        ResourceManager.#vertexArraysMap.clear();
    }
}