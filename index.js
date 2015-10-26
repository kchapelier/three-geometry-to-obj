"use strict";

var toObj = require('array-to-wavefront-obj'),
    commentString = '# Converted from a Three.Geometry with three-geometry-to-obj\n';

module.exports = function threeGeometryToObj (geometry, options) {

    options = options || {};

    var vertices = new Array(geometry.faces.length * 3),
        faces = new Array(geometry.faces.length * 3),
        normals = new Array(geometry.faces.length * 3),
        face,
        normal,
        vertex;

    for (var i = 0; i < geometry.faces.length; i++) {
        face = geometry.faces[i];

        faces[i * 3] = i * 3;
        faces[i * 3 + 1] = i * 3 + 1;
        faces[i * 3 + 2] = i * 3 + 2;

        vertex = geometry.vertices[face.a];

        vertices[i * 9] = vertex.x;
        vertices[i * 9 + 1] = vertex.y;
        vertices[i * 9 + 2] = vertex.z;

        vertex = geometry.vertices[face.b];

        vertices[i * 9 + 3] = vertex.x;
        vertices[i * 9 + 4] = vertex.y;
        vertices[i * 9 + 5] = vertex.z;

        vertex = geometry.vertices[face.c];

        vertices[i * 9 + 6] = vertex.x;
        vertices[i * 9 + 7] = vertex.y;
        vertices[i * 9 + 8] = vertex.z;

        if (options.normalSource === 'face') {
            normal = face.normal;

            normals[i * 9] = normal.x;
            normals[i * 9 + 1] = normal.y;
            normals[i * 9 + 2] = normal.z;

            normals[i * 9 + 3] = normal.x;
            normals[i * 9 + 4] = normal.y;
            normals[i * 9 + 5] = normal.z;

            normals[i * 9 + 6] = normal.x;
            normals[i * 9 + 7] = normal.y;
            normals[i * 9 + 8] = normal.z;
        } else {
            normal = face.vertexNormals[0];

            normals[i * 9] = normal.x;
            normals[i * 9 + 1] = normal.y;
            normals[i * 9 + 2] = normal.z;

            normal = face.vertexNormals[1];

            normals[i * 9 + 3] = normal.x;
            normals[i * 9 + 4] = normal.y;
            normals[i * 9 + 5] = normal.z;

            normal = face.vertexNormals[2];

            normals[i * 9 + 6] = normal.x;
            normals[i * 9 + 7] = normal.y;
            normals[i * 9 + 8] = normal.z;
        }

        /*
         if (face.faceVertexUvs.length === geometry.faces.length) {

         }
         */
    }

    return commentString + toObj(vertices, normals, null, faces);
};
