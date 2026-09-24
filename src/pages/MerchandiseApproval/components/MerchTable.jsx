import React from 'react';
import { Target, CreditCard, Edit3 } from 'lucide-react';
import { BentoGrid, BentoCard, Badge, Button, Table } from '@/components';

const MerchTable = ({ filteredGestores, updatingId, togglePremium, setEditingSettings }) => {
    const columns = [
        {
            key: 'identity',
            header: 'IDENTIDAD GESTOR',
            render: (_, g) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{g.first_name} {g.last_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{g.email}</div>
                </div>
            )
        },
        {
            key: 'premium',
            header: 'MEMBRESÍA PRO',
            render: (_, g) => (
                <Button 
                    size="small" 
                    variant={g.is_premium ? 'primary' : 'secondary'} 
                    loading={updatingId === g.id}
                    onClick={() => !updatingId && togglePremium(g.id, g.is_premium)}
                >
                    {g.is_premium ? 'PREMIUM' : 'ESTÁNDAR'}
                </Button>
            )
        },
        {
            key: 'status',
            header: 'ESTADO TIENDA',
            render: (_, g) => (
                <Badge variant={g.settings?.is_enabled ? 'success' : 'secondary'} rounded>
                    {g.settings?.is_enabled ? 'HABILITADA' : 'BLOQUEADA'}
                </Badge>
            )
        },
        {
            key: 'limit',
            header: 'LÍMITE PROD.',
            render: (_, g) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={12} /> {g.settings?.product_limit || 50}
                </div>
            )
        },
        {
            key: 'commission',
            header: 'COMISIÓN',
            render: (_, g) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CreditCard size={12} /> {g.settings?.commission_percentage || 10}%
                </div>
            )
        },
        {
            key: 'actions',
            header: 'ACCIONES',
            render: (_, g) => (
                <Button 
                    variant="info" 
                    size="small" 
                    onClick={() => setEditingSettings({...g})}
                >
                    <Edit3 size={14} /> AJUSTAR
                </Button>
            )
        }
    ];

    return (
        <BentoGrid>
            <BentoCard>
                <Table columns={columns} data={filteredGestores} />
            </BentoCard>
        </BentoGrid>
    );
};

export default MerchTable;
