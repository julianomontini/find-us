const graphql = require('graphql');
const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = graphql;

const PerfilType = require('./perfil_type');

const PerfilRepository = require('../../repository/perfil');

const UsuarioType = new GraphQLObjectType({
    name: 'UsuarioType',
    fields: {
        id: { type: GraphQLID },
        nome: { type: GraphQLString },
        email: { type: GraphQLString },
        cpf: { type: GraphQLString },
        celular: { type: GraphQLString },
        perfis: {
            type: new GraphQLList(PerfilType),
            resolve(pv, args, ctx){
                if(!ctx.user)
                    return [];
                return PerfilRepository.findPerfisByIdUsuario(ctx.user.id);
            }
        }
    }
})

module.exports = UsuarioType;