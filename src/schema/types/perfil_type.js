const graphql = require('graphql');
const {
    GraphQLString,
    GraphQLObjectType
} = graphql;

const PerfilType = new GraphQLObjectType({
    name: 'PerfilType',
    fields: {
        nome: { type: GraphQLString }
    }
})

module.exports = PerfilType;