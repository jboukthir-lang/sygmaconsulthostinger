import { NextResponse } from 'next/server';
import { lookupSiret } from '@/lib/api-siret';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const siret = searchParams.get('siret');

    if (!siret || siret.length < 9) {
        return NextResponse.json({ error: 'Invalid SIRET' }, { status: 400 });
    }

    try {
        const data = await lookupSiret(siret);

        if (!data) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
