Readme zur Coding Challenge von Bernhard Pauler
===============================================


Start der Anwendung:
--------------------

- In das Verzeichnis 'src' der Abgabe wechseln

- PHP built-in Webserver starten, z.B.:
C:\develop\hpc-dual-coding-challenge\src>php -S localhost:8000

- Aufruf der Sendungsübersicht im Browser mit der Adresse http://localhost:8000/


Informationen zur Anwendung:
----------------------------

Der Server stellt zwei API-Endpoints bereit:

1. /api/deliverables/
Schnittstelle für Abruf der Deliverables-Daten (auf Basis der Datei data.json)

2. /api/investigate/
Schnittstelle für Beauftragung einer Nachforschung mit Sendungsnummer
Ein Aufruf der Schnittstelle protokolliert die Sendungsnummer in der Datei investigate.log (im selben Verzeichnis).
