"""create_ai_cover_letter_exports_table

Revision ID: a8cb59a72e81
Revises: 7dc39537251a
Create Date: 2026-07-01 21:52:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a8cb59a72e81'
down_revision: Union[str, None] = '7dc39537251a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('ai_cover_letter_exports',
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('cover_letter_id', sa.Uuid(), nullable=False),
    sa.Column('optimization_id', sa.Uuid(), nullable=True),
    sa.Column('export_format', sa.String(length=20), nullable=False),
    sa.Column('template_name', sa.String(length=50), nullable=False),
    sa.Column('file_name', sa.String(length=255), nullable=False),
    sa.Column('file_size', sa.Integer(), nullable=False),
    sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.Column('id', sa.Uuid(), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['cover_letter_id'], ['ai_cover_letters.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['optimization_id'], ['ai_cover_letter_optimizations.id'], ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ai_cover_letter_exports_cover_letter_id'), 'ai_cover_letter_exports', ['cover_letter_id'], unique=False)
    op.create_index(op.f('ix_ai_cover_letter_exports_user_id'), 'ai_cover_letter_exports', ['user_id'], unique=False)
    op.create_index(op.f('ix_ai_cover_letter_exports_optimization_id'), 'ai_cover_letter_exports', ['optimization_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_ai_cover_letter_exports_optimization_id'), table_name='ai_cover_letter_exports')
    op.drop_index(op.f('ix_ai_cover_letter_exports_user_id'), table_name='ai_cover_letter_exports')
    op.drop_index(op.f('ix_ai_cover_letter_exports_cover_letter_id'), table_name='ai_cover_letter_exports')
    op.drop_table('ai_cover_letter_exports')
