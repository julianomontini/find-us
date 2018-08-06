const graphql = require('graphql');
const {
    GraphQLString,
    GraphQLObjectType,
    GraphQLID
} = graphql;

const TagType = new GraphQLObjectType({
    name: 'TagType',
    fields: {
        id: { type: GraphQLID },
        nome: { type: GraphQLString },
        nome_simples: { type: GraphQLString }
    }
})

module.exports = TagType;