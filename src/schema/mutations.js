const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const UsuarioType = require('./types/usuario_type');
const ReqAulaType = require('./types/req_aula_type');
const TagType = require('./types/tag_type');

const UsuarioService = require('../services/usuario');
const AuthService = require('../services/authentication');
const ReqAulaService = require('../services/reqAula');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        criarUsuario: {
            type: UsuarioType,
            args: {
                nome: {type: new GraphQLNonNull(GraphQLString)}, 
                email: {type: new GraphQLNonNull(GraphQLString)}, 
                senha: {type: new GraphQLNonNull(GraphQLString)}, 
                cpf: {type: new GraphQLNonNull(GraphQLString)}, 
                celular: {type: new GraphQLNonNull(GraphQLString)},
                perfil: { type: new GraphQLList(GraphQLString)}
            },
            resolve(pv, params, req){
                return UsuarioService.criarUsuario(params)
            }
        },
        login: {
            type: GraphQLString,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                senha: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(pv, {email, senha}, req){
                return AuthService.login({email, senha, req})
            }
        },
        criarReqAula: {
            type: ReqAulaType,
            args: {
                titulo: { type: new GraphQLNonNull(GraphQLString) },
                descricao: { type: new GraphQLNonNull(GraphQLString) },
                inicio: { type: new GraphQLNonNull(GraphQLString) },
                fim: { type: new GraphQLNonNull(GraphQLString) },
                tags: { type: new GraphQLList(GraphQLString)}
            },
            resolve(pv, {titulo, descricao, inicio, fim, tags}, ctx){
                if(!ctx.user)
                    return Promise.reject('Acesso negado');
                return ReqAulaService.criar({titulo, descricao, inicio, fim, idUsuario: ctx.user.id, tags});
            }
        }
    }
})

module.exports = mutation;