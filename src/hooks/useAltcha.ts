import { useState, useEffect } from "react";
import { solveChallenge } from "altcha-lib";
import { API_URL } from "../api/apiConfig";

export interface AltchaChallenge {
  algorithm: string;
  challenge: string;
  salt: string;
  signature: string;
  maxnumber?: number;
}

export const useAltcha = () => {
  const [challenge, setChallenge] = useState<AltchaChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);

  // Obtener el challenge al montar el componente
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!API_URL) {
          throw new Error("No se encontró la URL base de la API");
        }

        const response = await fetch(`${API_URL}/public/challenge`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Error al obtener challenge: ${response.statusText}`,
          );
        }

        const challengeData: AltchaChallenge = await response.json();
        setChallenge(challengeData);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Error desconocido");
        setError(error);
        console.error("Error al obtener challenge de Altcha:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
  }, []);

  // Resolver el challenge cuando se necesite
  const solveAltcha = async (): Promise<string | null> => {
    if (!challenge) {
      console.warn("No hay challenge disponible para resolver");
      return null;
    }

    try {
      // Usar solveChallenge de altcha-lib
      // La función resuelve el challenge y devuelve el payload en formato base64
      const { promise } = solveChallenge(
        challenge.challenge,
        challenge.salt,
        challenge.algorithm,
        challenge.maxnumber || 1000000,
      );
      
      const solution = await promise;
      
      // La solución incluye el número encontrado, necesitamos crear el payload completo
      const solutionPayload = {
        algorithm: challenge.algorithm,
        challenge: challenge.challenge,
        salt: challenge.salt,
        number: solution.number,
        signature: challenge.signature,
      };

      // Convertir a base64
      const solutionJson = JSON.stringify(solutionPayload);
      const encoder = new TextEncoder();
      const solutionBytes = encoder.encode(solutionJson);
      const base64 = btoa(
        String.fromCharCode(...new Uint8Array(solutionBytes)),
      );

      setAltchaPayload(base64);
      return base64;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error al resolver challenge");
      console.error("Error al resolver challenge de Altcha:", error);
      setError(error);
      return null;
    }
  };

  return {
    challenge,
    isLoading,
    error,
    altchaPayload,
    solveAltcha,
  };
};
