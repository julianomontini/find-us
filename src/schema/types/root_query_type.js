const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList  } = graphql;

const UsuarioType = require('./usuario_type');
const ReqAulaType = require('./req_aula_type');

const ReqAulaService = require('../../services/reqAula');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    me: {
      type: UsuarioType,
      resolve(pv, args, req){
        return req.user;
      }
    },
    requisicoes_aula: {
      type: new GraphQLList(ReqAulaType),
      resolve(pv, args, req){
        if(!req.user)
          return Promise.reject("Acesso negado");
        return ReqAulaService.getReqAulaAluno(req.user.id);
      }
    }
  }
});

module.exports = RootQueryType;
