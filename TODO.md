# TODO: Adicionar opção de cancelar reserva na dashboard de usuário comum

- [x] Modificar getReservas no reservaController.ts para aceitar filtro por usuarioId
- [x] Modificar GET /api/reservas/route.ts para aceitar query usuarioId
- [x] Adicionar função cancelReserva no reservaController.ts com verificação se o usuário é o dono da reserva
- [x] Modificar PATCH /api/reservas/[id]/route.ts para usar cancelReserva quando status="Cancelada"
- [x] Adicionar seção "Minhas Reservas" no DashboardComum.tsx com lista de reservas ativas do usuário e botão cancelar
