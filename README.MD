# Format

  - Title: RED (Rogue Exterminate (un)Dead)
  - Author: Matthias Ngo
  - Year and season (Summer, Winter): Sommersemester 2022
  - Curriculum and semester: AIN6
  - Course this development was created in: PRIMA
  - Docent: Prof. Jirka Dell'Oro-Friedl
  * Link to the finished and executable application on Github-Pages: "TODO"
  * Link to the source code: "TODO"
  * Link to the design document: "TODO"
  * Description for users on how to interact: Charakter kann mit [w,a,s,d] oder Pfeiltasten gesteuert werden. Um zu angreifen, wird die Leertaste verwendet. Angriffe besitzen cooldown und können nicht sofort wiederholt werden.


# Checklist for the final assignment

© Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU
| Nr | Criterion | Explanation |
|---:|---------------------|---------------------------------------------------------------------------------------------------------------------|
| 1 | Units and Positions | Das Spiel ist ein 2D Spiel und verwendet die X und Y-Achsen. Der Mittelpunkt des Spielfelds ist der Nullpunkt und gleichzeitig der Spawn Point des Spielers. Mit dem Gedanken, dass 1 Unit etwa 1 Meter entspricht, ist der Spieler etwa auf 1,7 Meter skaliert.|
| 2 | Hierarchy | Die Hierarchy ist sehr flach angelegt. Alle Nodes worauf zugegriffen wird, sind weiter oben in der Hierachy um ein schnellen Zugriff zu erlauben. Hintergund und Wände, worauf nicht zugegrfiffen werden und die aus mehreren Teilen bestehen sind weiter unten in der Hierachy. Diese Struktur kann naturlüch beim Überlick ein Nachteil sein. |
| 3 | Editor | Hintergrund, Wände, Licht und Sounds wurden im Editor erstellt. Es ist einfacher, den statischen Wänden eine rigid Body Komponente hinzu zufügen. Beleuchtung konnte gut im Editor angepasst werden, da das Ergebnis sofort sichtbar war. Der Rest wurde per Code gelöst. |
| 4 | Scriptcomponents | --- |
| 5 | Extend | Spieler und Gegner sind von der Node Klasse erweitert. --- |
| 6 | Sound | Angriffe, Laufen und Treffer des Avatars können akustisch wahrgenommen werden. |
| 7 | VUI | Der Spieler wird über Health, Level und Score per Visual User Interface informiert. |
| 8 | Event-System | --- |
| 9 | External Data | Der Spieler kann im Config File die Maximale Geschwindigkeit sowie die Beschleunigung des Avatars festlegen. |
| A | Light | Licht wird verwendet, um das Spielfeld zu beleuchten und je nach Health des Spielers wird das Spielfeld rötlicher durch die Beleuchtung. |
| B | Physics | Physics wird verwendet, um bei den Wänden ein Bounce Effekt zu erzeugen, falls der Spieler gegen die Wand läuft. |
| C | Net | --- |
| D | State Machines | State Machines wir bei den Gegnern verwendet um zischen den Zuständen "verfolgen" oder "repositionieren" zu wechseln |
| E | Animation | Sprite Animation wird für die Darstellung von Avatar und Gegner sowie deren Aktionen verwendet. |