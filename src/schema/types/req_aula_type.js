const graphql = require('graphql');
const {
    GraphQLString,
    GraphQLObjectType,
    GraphQLID,
    GraphQLList
} = graphql;

const TagType = require('./tag_type');

const TagRepository = require('../../repository/tag');

const ReqAulaType = new GraphQLObjectType({
    name: 'ReqAulaType',
    fields: {
        id: { type: GraphQLID },
        titulo: { type: GraphQLString },
        descricao: { type: GraphQLString },
        inicio: { type: GraphQLString },
        fim: { type: GraphQLString },
        tags: {
            type: new GraphQLList(TagType),
            resolve(pv){
                return TagRepository.procuraTagsPorIdAula(pv.id);
            }
        }
    }
})

module.exports = ReqAulaType;