
import connectMongo from "@/services/mongodb";
import Usuario, { IUsuario } from "../models/usuario";

//listar todos os Usuários
export const getUsuarios = async () => {
  await connectMongo(); //estabelece conexão
  const usuarios = await Usuario.find({}); //lista todos os usuários da colecção
  return usuarios;
};
//listar um usuário
export const getUsuarioById = async (id: string) => {
  await connectMongo();
  const usuario = await Usuario.findById(id);
  return usuario;
};
//criar usuário
export const createUsuario = async (data: Partial<IUsuario>) => {
  await connectMongo();
  // Se tipo não for fornecido, definir como "Comum" para registro de usuário comum
  if (!data.tipo) {
    data.tipo = "Comum";
  }
  // Set username to email for uniqueness
  data.username = data.email;
  const novoUsuario = new Usuario(data);
  const novoUsuarioId = novoUsuario.save();
  return novoUsuarioId;
};

//atualziar dados do Usuário
export const updateUsuario = async (id: string, data: Partial<IUsuario>) => {
  await connectMongo();
  const usuario = await Usuario.findByIdAndUpdate(id, data, { new: true });
  return usuario;
};

//deletar usuário
export const deleteUsuario = async (id: string) => {
  await connectMongo();
  await Usuario.findByIdAndDelete(id);
};

//métodos de autenticação de usuário (login) ( senha é passada criptografada)
export const autenticaUsuario = async (email: string, senha: string) => {
    await connectMongo();
    //busca o usuário pelo email e a senha ainda criptografada
    const usuario = await Usuario.find({email}).select("+senha");
    // usuário não encontrado
    if(!usuario || usuario.length === 0) return null;
    //comparar a senha digita com a senha do banco
    const senhaSecreta =  await usuario[0].comparePassword(senha);
    if(!senhaSecreta) return null; //senha incorreta
    // se deu certo retrona o usuário
    return usuario[0];
};

