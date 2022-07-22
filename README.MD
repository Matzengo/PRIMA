# Format

  - Title: RED (Rogue Exterminate (un)Dead)
  - Author: Matthias Ngo
  - Year and season (Summer, Winter): Sommersemester 2022
  - Curriculum and semester: AIN6
  - Course this development was created in: PRIMA
  - Docent: Prof. Jirka Dell'Oro-Friedl
  * Link to the finished and executable application on Github-Pages: https://matzengo.github.io/PRIMA/RED/index.html (Funktioniert leider nicht über github wegen NodeSprite.isActive Probleme) Bitte herunterladen und über VS CODE starten.
  * Link to the source code: https://github.com/Matzengo/PRIMA/tree/main/RED
  * Link to the design document: https://github.com/Matzengo/PRIMA/tree/main/RED/Documentation/RED.pdf
  * Description for users on how to interact: Charakter kann mit [w,a,s,d] oder Pfeiltasten gesteuert werden. Um zu angreifen, wird die Leertaste verwendet. Angriffe besitzen cooldown und können nicht sofort wiederholt werden.


# Checklist for the final assignment

© Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU
| Nr | Criterion | Explanation |
|---:|---------------------|---------------------------------------------------------------------------------------------------------------------|
| 1 | Units and Positions | Das Spiel ist ein 2D Spiel und verwendet die X und Y-Achsen. Der Mittelpunkt des Spielfelds ist der Nullpunkt und gleichzeitig der Spawn Point des Spielers. Mit dem Gedanken, dass 1 Unit etwa 1 Meter entspricht, ist der Spieler etwa auf 1,7 Meter skaliert.|
| 2 | Hierarchy | Die Hierarchie ist sehr flach angelegt. Alle Nodes worauf zugegriffen wird, sind weiter oben in der Hierarchie, um einen schnellen Zugriff zu erlauben. Hintergrund und Wände, worauf nicht zugegriffen werden und die aus mehreren Teilen bestehen, sind weiter unten in der Hierarchie. Diese Struktur kann natürlich beim Überblick ein Nachteil sein. |
| 3 | Editor | Hintergrund, Wände, Licht und Sounds wurden im Editor erstellt. Es ist einfacher, den statischen Wänden eine rigid Body Komponente hinzu zufügen. Beleuchtung konnte gut im Editor angepasst werden, da das Ergebnis sofort sichtbar war. Der Rest wurde per Code gelöst. |
| 4 | Scriptcomponents | Script Componente wird verwendet, um neue Spawn Positionen zu generieren. |
| 5 | Extend | Spieler und Gegner sind von der Klasse Actor abgeleitet. Actor wiederum ist von der Node Klasse abgeleitet. Damit sind Spieler und Gegner Nodes und es ist einfacher, Komponente an die Nodes anzuhängen. |
| 6 | Sound | Angriffe, Laufen und Treffer des Avatars können akustisch wahrgenommen werden. |
| 7 | VUI | Der Spieler wird über Health, Level und Score per Visual User Interface informiert. |
| 8 | Event-System | Ein Keyboard Event hilft bei er Erkennung von Angriffen (SpaceBar) |
| 9 | External Data | Der Spieler kann im Config File die maximale Geschwindigkeit sowie die Beschleunigung des Avatars festlegen. |
| A | Light | Licht wird verwendet, um das Spielfeld zu beleuchten und je nach Health des Spielers wird das Spielfeld rötlicher durch die Beleuchtung. |
| B | Physics | Physics wird verwendet, um bei den Wänden ein Bounce Effekt zu erzeugen, falls der Spieler gegen die Wand läuft. |
| C | Net | --- |
| D | State Machines | State Machines wir bei den Gegnern verwendet, um zwischen den Zuständen "verfolgen" oder "positionieren" zu wechseln. |
| E | Animation | Sprite Animation wird für die Darstellung von Avatar und Gegner sowie deren Aktionen verwendet. |