import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    console.log("Nouvel abonné Newsletter :", email);

    return NextResponse.json(
      { message: 'Inscription réussie à la newsletter !' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête' },
      { status: 500 }
    );
  }
}